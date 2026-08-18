import type { GraphicsAssetKey } from '@/context/AppGraphicsContext'

const PROJECT_FOLDER_STORAGE_KEY = 'rezolve-project-root-directory'
const PROJECT_FOLDER_DB_NAME = 'rezolve-project-assets'
const PROJECT_FOLDER_STORE_NAME = 'project-folders'
const GRAPHICS_OVERRIDES_DIRECTORY_NAME = 'graphics'
const GRAPHICS_OVERRIDES_MANIFEST_FILE_NAME = 'manifest.json'

const assetFileNames: Record<GraphicsAssetKey, string> = {
  platformSidebarLogo: 'sidebar-app-logo.png',
  profileImage: 'sidebar-profile-placeholder.png',
  merchantHeaderLogo: 'merchant-logo.png',
  walletSetupIcon: 'wallet-setup-icon.svg',
  visaCardIcon: 'card-visa-icon.svg',
  mastercardCardIcon: 'card-mastercard-icon.svg',
  amexCardIcon: 'card-amex-icon.svg',
  applePayIcon: 'pay-other-apple-icon.svg',
  payPalIcon: 'pay-other-paypal-icon.svg',
  googlePayIcon: 'pay-other-google-icon.svg',
  bankPayIcon: 'pay-bank-icon.svg',
}

type GraphicsOverrideManifestEntry = {
  fileName: string
  updatedAt: number
}

type GraphicsOverridesManifest = Partial<Record<GraphicsAssetKey, GraphicsOverrideManifestEntry>>

function getDataUrlMimeType(dataUrl: string) {
  const match = /^data:([^;,]+)[;,]/i.exec(dataUrl)
  return match?.[1]?.toLowerCase() ?? null
}

function isGraphicsAssetKey(value: string): value is GraphicsAssetKey {
  return value in assetFileNames
}

function getExtensionFromMimeType(mimeType: string) {
  const normalizedMime = mimeType.toLowerCase()

  if (normalizedMime === 'image/svg+xml') {
    return 'svg'
  }
  if (normalizedMime === 'image/png') {
    return 'png'
  }
  if (normalizedMime === 'image/jpeg') {
    return 'jpg'
  }
  if (normalizedMime === 'image/webp') {
    return 'webp'
  }
  if (normalizedMime === 'image/gif') {
    return 'gif'
  }
  if (normalizedMime === 'image/avif') {
    return 'avif'
  }
  if (normalizedMime === 'image/bmp') {
    return 'bmp'
  }
  if (normalizedMime === 'image/x-icon' || normalizedMime === 'image/vnd.microsoft.icon') {
    return 'ico'
  }

  return null
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  if (!response.ok) {
    throw new Error('Unable to decode the uploaded image.')
  }

  return response.blob()
}

async function ensureWritableDirectory(directoryHandle: FileSystemDirectoryHandle) {
  const handleWithPermissions = directoryHandle as unknown as {
    queryPermission: (options: { mode: 'readwrite' }) => Promise<PermissionState>
    requestPermission: (options: { mode: 'readwrite' }) => Promise<PermissionState>
  }

  const permission = await handleWithPermissions.queryPermission({ mode: 'readwrite' })
  if (permission === 'granted') {
    return directoryHandle
  }

  const requestedPermission = await handleWithPermissions.requestPermission({ mode: 'readwrite' })
  if (requestedPermission !== 'granted') {
    throw new Error('Write access to the project folder was not granted.')
  }

  return directoryHandle
}

async function hasDirectory(directoryHandle: FileSystemDirectoryHandle, directoryName: string) {
  try {
    await directoryHandle.getDirectoryHandle(directoryName, { create: false })
    return true
  } catch {
    return false
  }
}

async function hasFile(directoryHandle: FileSystemDirectoryHandle, fileName: string) {
  try {
    await directoryHandle.getFileHandle(fileName, { create: false })
    return true
  } catch {
    return false
  }
}

async function isProjectRootDirectory(directoryHandle: FileSystemDirectoryHandle) {
  const [hasPackageJson, hasSrcDirectory] = await Promise.all([
    hasFile(directoryHandle, 'package.json'),
    hasDirectory(directoryHandle, 'src'),
  ])

  return hasPackageJson || hasSrcDirectory
}

async function getGraphicsOverridesDirectory(projectRoot: FileSystemDirectoryHandle) {
  if (projectRoot.name === GRAPHICS_OVERRIDES_DIRECTORY_NAME) {
    return projectRoot
  }

  if (projectRoot.name === 'public') {
    return projectRoot.getDirectoryHandle(GRAPHICS_OVERRIDES_DIRECTORY_NAME, { create: true })
  }

  if (await isProjectRootDirectory(projectRoot)) {
    const publicDirectory = await projectRoot.getDirectoryHandle('public', { create: true })
    return publicDirectory.getDirectoryHandle(GRAPHICS_OVERRIDES_DIRECTORY_NAME, { create: true })
  }

  throw new Error('Selected folder must be the project root, public folder, or public/graphics folder.')
}

async function readGraphicsOverridesManifest(directoryHandle: FileSystemDirectoryHandle): Promise<GraphicsOverridesManifest> {
  try {
    const manifestHandle = await directoryHandle.getFileHandle(GRAPHICS_OVERRIDES_MANIFEST_FILE_NAME, { create: false })
    const manifestFile = await manifestHandle.getFile()
    const manifestText = await manifestFile.text()
    const parsedManifest = JSON.parse(manifestText) as unknown

    if (!parsedManifest || typeof parsedManifest !== 'object') {
      return {}
    }

    const manifestObject = parsedManifest as Record<string, unknown>
    const normalizedManifest: GraphicsOverridesManifest = {}

    for (const [key, value] of Object.entries(manifestObject)) {
      if (!isGraphicsAssetKey(key)) {
        continue
      }

      if (!value || typeof value !== 'object') {
        continue
      }

      const entry = value as { fileName?: unknown; updatedAt?: unknown }
      if (typeof entry.fileName !== 'string') {
        continue
      }

      const updatedAt = typeof entry.updatedAt === 'number' ? entry.updatedAt : Date.now()
      normalizedManifest[key] = {
        fileName: entry.fileName,
        updatedAt,
      }
    }

    return normalizedManifest
  } catch {
    return {}
  }
}

async function writeGraphicsOverridesManifest(directoryHandle: FileSystemDirectoryHandle, manifest: GraphicsOverridesManifest) {
  const manifestHandle = await directoryHandle.getFileHandle(GRAPHICS_OVERRIDES_MANIFEST_FILE_NAME, { create: true })
  const writableManifest = await manifestHandle.createWritable()
  await writableManifest.write(`${JSON.stringify(manifest, null, 2)}\n`)
  await writableManifest.close()
}

function openProjectFolderDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(PROJECT_FOLDER_DB_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(PROJECT_FOLDER_STORE_NAME)
    }

    request.onerror = () => {
      reject(request.error ?? new Error('Unable to open the project folder database.'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}

export async function loadStoredProjectRootDirectory() {
  if (!('indexedDB' in window)) {
    return null
  }

  const database = await openProjectFolderDatabase()

  try {
    const handle = await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const transaction = database.transaction(PROJECT_FOLDER_STORE_NAME, 'readonly')
      const store = transaction.objectStore(PROJECT_FOLDER_STORE_NAME)
      const request = store.get(PROJECT_FOLDER_STORAGE_KEY)

      request.onerror = () => reject(request.error ?? new Error('Unable to read the stored project folder.'))
      request.onsuccess = () => resolve((request.result as FileSystemDirectoryHandle | null) ?? null)
    })

    if (!handle) {
      return null
    }

    return handle
  } finally {
    database.close()
  }
}

export async function storeProjectRootDirectory(directoryHandle: FileSystemDirectoryHandle) {
  if (!('indexedDB' in window)) {
    return
  }

  const database = await openProjectFolderDatabase()

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(PROJECT_FOLDER_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(PROJECT_FOLDER_STORE_NAME)
      const request = store.put(directoryHandle, PROJECT_FOLDER_STORAGE_KEY)

      request.onerror = () => reject(request.error ?? new Error('Unable to store the project folder.'))
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error ?? new Error('Unable to store the project folder.'))
    })
  } finally {
    database.close()
  }
}

export async function clearStoredProjectRootDirectory() {
  if (!('indexedDB' in window)) {
    return
  }

  const database = await openProjectFolderDatabase()

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(PROJECT_FOLDER_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(PROJECT_FOLDER_STORE_NAME)
      const request = store.delete(PROJECT_FOLDER_STORAGE_KEY)

      request.onerror = () => reject(request.error ?? new Error('Unable to clear the stored project folder.'))
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error ?? new Error('Unable to clear the stored project folder.'))
    })
  } finally {
    database.close()
  }
}

export async function pickProjectRootDirectory() {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('This browser does not support project-folder writes.')
  }

  const picker = window.showDirectoryPicker as () => Promise<FileSystemDirectoryHandle>
  const selectedDirectory = await picker()
  return ensureWritableDirectory(selectedDirectory)
}

export async function saveGraphicAssetToProject(projectRoot: FileSystemDirectoryHandle, assetKey: GraphicsAssetKey, imageDataUrl: string) {
  const writableRoot = await ensureWritableDirectory(projectRoot)
  const graphicsDirectory = await getGraphicsOverridesDirectory(writableRoot)
  const blob = await dataUrlToBlob(imageDataUrl)
  const mimeType = blob.type || getDataUrlMimeType(imageDataUrl) || ''

  if (!mimeType.startsWith('image/')) {
    throw new Error('Selected file is not a supported image format.')
  }

  const extension = getExtensionFromMimeType(mimeType)
  if (!extension) {
    throw new Error(`Image type ${mimeType} is not supported for project save.`)
  }

  const fileName = `${assetKey}.${extension}`
  const fileHandle = await graphicsDirectory.getFileHandle(fileName, { create: true })
  const writableFile = await fileHandle.createWritable()

  await writableFile.write(blob)
  await writableFile.close()

  const manifest = await readGraphicsOverridesManifest(graphicsDirectory)
  manifest[assetKey] = {
    fileName,
    updatedAt: Date.now(),
  }
  await writeGraphicsOverridesManifest(graphicsDirectory, manifest)
}

export async function saveAllGraphicsToProject(projectRoot: FileSystemDirectoryHandle, graphics: Partial<Record<GraphicsAssetKey, string>>) {
  for (const assetKey of Object.keys(assetFileNames) as GraphicsAssetKey[]) {
    const imageDataUrl = graphics[assetKey]
    if (!imageDataUrl) {
      continue
    }

    await saveGraphicAssetToProject(projectRoot, assetKey, imageDataUrl)
  }
}

export async function loadGraphicsOverridesFromPublic() {
  try {
    const response = await fetch(`/${GRAPHICS_OVERRIDES_DIRECTORY_NAME}/${GRAPHICS_OVERRIDES_MANIFEST_FILE_NAME}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return {} as Partial<Record<GraphicsAssetKey, string>>
    }

    const parsedManifest = (await response.json()) as Record<string, unknown>
    const overrides: Partial<Record<GraphicsAssetKey, string>> = {}

    for (const [key, value] of Object.entries(parsedManifest)) {
      if (!isGraphicsAssetKey(key)) {
        continue
      }

      if (!value || typeof value !== 'object') {
        continue
      }

      const entry = value as { fileName?: unknown; updatedAt?: unknown }
      if (typeof entry.fileName !== 'string') {
        continue
      }

      const version = typeof entry.updatedAt === 'number' ? entry.updatedAt : Date.now()
      overrides[key] = `/${GRAPHICS_OVERRIDES_DIRECTORY_NAME}/${entry.fileName}?v=${version}`
    }

    return overrides
  } catch {
    return {} as Partial<Record<GraphicsAssetKey, string>>
  }
}
