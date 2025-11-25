# Navbar Dropdown - Manual QA Checklist

## Desktop Testing

### Visual & Interaction
- [ ] SERVICES link shows chevron (▼) icon
- [ ] Hovering over SERVICES opens dropdown menu
- [ ] Dropdown appears below SERVICES link, centered
- [ ] Dropdown has smooth fade-in animation (~150ms)
- [ ] Dropdown shows 4 service items: 3D Modeling, 2D Detailing, Parts Inspection, Machine Assembly
- [ ] Hovering over dropdown items highlights them
- [ ] Moving mouse away from dropdown closes it (with small delay)
- [ ] Active service item shows left border indicator
- [ ] Slider underline animates to SERVICES when active

### Keyboard Navigation
- [ ] Tab key focuses SERVICES button
- [ ] Enter/Space on SERVICES toggles dropdown
- [ ] Arrow Down opens dropdown and focuses first item
- [ ] Arrow Up/Down navigates between dropdown items
- [ ] Arrow Up from first item closes dropdown and returns focus to SERVICES
- [ ] Tab cycles through dropdown items when open
- [ ] Shift+Tab from first dropdown item returns to SERVICES
- [ ] Escape key closes dropdown and returns focus to SERVICES
- [ ] Focus indicator is visible (outline) on all interactive elements

### Navigation
- [ ] Clicking SERVICES parent link navigates to /services
- [ ] Clicking dropdown item navigates to correct service section
- [ ] Hash anchors work correctly (#service-3d-modeling, etc.)
- [ ] Page scrolls to correct section after navigation
- [ ] Active state updates when on a service section

## Mobile Testing

### Visual & Interaction
- [ ] SERVICES shows chevron (▼) in mobile menu
- [ ] Tapping SERVICES toggles expand/collapse (doesn't navigate)
- [ ] Chevron rotates when expanded
- [ ] Dropdown items appear below SERVICES, indented
- [ ] Dropdown has smooth slide-down animation
- [ ] Mobile menu overlay doesn't close when tapping inside dropdown

### Navigation
- [ ] Tapping dropdown item navigates to service section
- [ ] Mobile menu closes after navigation
- [ ] Hash anchors work correctly on mobile
- [ ] Page scrolls to correct section

## Accessibility Testing

### Screen Reader
- [ ] SERVICES button announces "SERVICES menu" with aria-label
- [ ] aria-expanded announces state (true/false)
- [ ] Dropdown items are announced as menu items
- [ ] Active item is properly identified

### Keyboard Only
- [ ] All functionality works without mouse
- [ ] Focus never gets trapped
- [ ] Focus order is logical (Tab sequence)
- [ ] Escape always closes dropdown

## Cross-browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Edge Cases
- [ ] Clicking outside dropdown closes it
- [ ] Rapid hover/unhover doesn't cause flickering
- [ ] Dropdown closes when navigating to different page
- [ ] Dropdown works when SERVICES is active page
- [ ] Multiple rapid keyboard presses handled gracefully

