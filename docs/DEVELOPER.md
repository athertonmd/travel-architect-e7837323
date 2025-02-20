
# Developer Documentation

## Project Structure

The application is built using React, TypeScript, and Vite, with the following key technologies:
- React Query for data fetching and state management
- Supabase for backend services
- Shadcn UI for component library
- Tailwind CSS for styling

### Key Components and Features

#### Trip Management
- `FlowEditor`: Main component for visual trip editing
- `TripContent`: Handles the layout of the trip editor
- `SegmentForms`: Various form components for different trip segments (Flight, Hotel, Train, etc.)

### State Management
- Uses React Query for server state
- Local state managed through React hooks
- Custom hooks like `useTimeState` for specific functionality

### Important Hooks
1. `useTripData`: Fetches and manages trip data
2. `useTripUpdates`: Handles trip updates and mutations
3. `useFlowState`: Manages the flow editor state
4. `useNodeManagement`: Handles node operations in the flow editor

### Form Components
Each segment type (Train, Flight, Hotel, etc.) has its own form component with:
- Date/time selection
- Location inputs
- Specific details relevant to the segment type

### Data Flow
1. User actions trigger local state updates
2. Changes are synchronized with Supabase using React Query mutations
3. Success/error feedback provided through toast notifications

### Type System
- `SegmentDetails`: Base type for all segment data
- `SegmentNodeData`: Type for flow editor nodes
- `JsonValue`: Type for Supabase JSON columns

## Development Guidelines

### Adding New Features
1. Create new components in appropriate directories
2. Use existing hooks and utilities where possible
3. Follow TypeScript type definitions
4. Add error handling and loading states

### Best Practices
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow existing patterns for form handling
- Implement proper type checking
