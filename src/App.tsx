import { Navigate, Route, Routes } from 'react-router-dom'

import { AppGraphicsProvider } from '@/context/AppGraphicsContext'
import { AppUserRoleProvider } from '@/context/AppUserRoleContext'
import { ChangeLogPage } from '@/pages/ChangeLogPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { DocumentationPage } from '@/pages/DocumentationPage'
import { WidgetDesignPage } from '@/pages/WidgetDesignPage'

export default function App() {
  return (
    <AppGraphicsProvider>
      <AppUserRoleProvider>
        <Routes>
          <Route path="/" element={<WidgetDesignPage section="merchants" />} />
          <Route path="/psp-providers" element={<WidgetDesignPage section="psp-providers" />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          <Route path="/change-log" element={<ChangeLogPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppUserRoleProvider>
    </AppGraphicsProvider>
  )
}
