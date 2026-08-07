# Project Agent Rules

These rules are mandatory for all future work in this repository.

1. Reuse existing components first.
- If a new component is required, ask the user before creating it.

2. Reuse existing colors first.
- If a new color is required, ask the user before adding it.

3. All colors must be stored in CSS variables.
- No hardcoded color values in component files.

4. Do not create inline UI structure when a reusable component can be used.
- Prefer existing design-system components.
- Extend existing components before creating new ones.

5. Every component must consider accessibility and quality.
- Respect WCAG contrast requirements.
- Support interactive states where relevant: default, hover, focus-visible, active, disabled.
- Keep keyboard accessibility and semantic HTML.
