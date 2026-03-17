# WebServerLogs Architecture & Flow Documentation

This document details the architecture of the [WebServerLogs](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#66-218) module, explaining its UI structure, data fetching logic, and the high-contrast terminal interface.

---

## 1. Overview & UI Structure

The [WebServerLogs](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#66-218) module ([src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx)) provides a centralized interface for viewing Nginx and Apache logs.

### UI Components
- **List View**: A vertical list of log types (Access, Error) represented by the [LogTypeListItem](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#21-64) component.
- **Terminal Modal**: The [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362) component, which provides a high-contrast, console-like viewing experience.
- **Dynamic Stack Detection**: The list of logs is dynamically generated based on the website's `stack_type` (e.g., `nginx+apache` shows both access/error logs for both servers).

---

## 2. Data Fetching & Redux Architecture

### API Thunks ([websiteSlice.ts](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/redux/slice/websiteSlice.ts))
Logs are fetched using two primary thunks:
- `getNginxLog`: Fetches `/api/v2/nginx-logs/websites/...`.
- `getApacheLog`: Fetches `/api/v2/apache-logs/websites/...`.

**Parameters**:
- `serverid`, `webid`: Context identifiers.
- `scroll_count`: Used for infinite scrolling (page number).
- `log`: Specifies `'access'` or `'error'`.

### State Management
The `websiteSlice` maintains four dedicated state slices for logs:
- `nginxLog`, `nginxErrolog`
- `apchelog`, `apcheErrolog`

Each slice contains:
- `logs`: An array of strings (log lines).
- `total_count`: The total number of log lines available on the server.

---

## 3. The Terminal Flow (Data to UI)

When a user selects a log type (e.g., "NGINX Access"), the following flow occurs:

### 1. Selection & Initialization
- [handleSelectLog(logType)](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#127-132) is called in [WebServerLogs](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#66-218).
- `isModalOpen` is set to `true`.
- The `fetchlogs` function (wrapped in `useCallback`) is passed to [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362).

### 2. Fetching & Pagination
- Inside [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362), an `useEffect` triggers the initial fetch (`fetchlogs(1)`).
- **Infinite Scroll**: The `handleScroll` function monitors the scroll position of the terminal container. When the user scrolls near the bottom, it increments the `scroll_count` and triggers `fetchlogs` for the next page.

### 3. Parsing & Rendering ([formatLog](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#151-251))
The [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362) processes each log line before rendering:
- **Access Logs**: Parsed via regex (`accessLogRegex`) to extract IP, Timestamp, Request, Status Code, and Size. These are rendered in a structured, multi-column format with color-coding (e.g., 2xx = Green, 4xx/5xx = Orange/Red).
- **Error Logs**: Rendered as raw text but color-coded using [getErrorLogStyle](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#40-50). Keywords like "Fatal" or "Critical" are bolded.
- **Row Numbering**: Every line is prefixed with a zero-padded row number (e.g., `0001 |`).

---

## 4. Modal Interactions

The [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362) is highly interactive:
- **Tabs**: Users can switch between different log types (Nginx Access, Nginx Error, etc.) directly within the modal. Switching tabs resets the scroll position and the page count.
- **Theme**: Uses a "Linux/iTerm" dark theme (Pure Black background, Cyan row numbers, Vibrant text colors).
- **Infinite Scroll**: Seamlessly appends new logs to the existing list via the Redux `...currentState.logs, ...action.payload.message.logs` pattern.

---

## 4. LogTerminal Architecture Deep-Dive

The [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362) is the core engine for log visualization, designed to handle large streams of data efficiently.

### Internal Logic & Function Calling

#### 1. Lifecycle & Initial Fetch
When the modal opens or the `selectedLogType` changes:
- `useEffect` (line 123) is triggered.
- It resets `currentPage` to 1.
- It calls `fetchlogs(1)` to get the most recent logs.
- It clears the scroll position (`terminalRef.current.scrollTop = 0`).

#### 2. Event Handling: Infinite Scroll
The component uses a native DOM scroll listener for maximum performance:
- `handleScroll` (line 95): Calculates if the user is near the bottom of the container.
- **Threshold**: It triggers when `scrollHeight - scrollTop <= clientHeight + 100`.
- **Calling Mechanism**: If the threshold is met AND logs are not currently loading, it calculates the next page (`pagesLoaded + 1`) and calls the `fetchlogs(nextPage)` callback provided by the parent.

#### 3. Reactive Data Syncing
The terminal uses `useAppSelector` (line 68) to watch the global Redux state.
- **Switch Case Logic**: It dynamically selects the correct state slice (`nginxLog`, `nginxErrolog`, etc.) based on the `selectedLogType` prop.
- **Memoization**: `displayedLogs` (line 89) uses `useMemo` to reverse the logs array only when the underlying data changes, ensuring the latest logs appear at the top.

#### 4. Formatting Pipeline ([formatLog](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#151-251))
Every log line passes through a formatting function that performs:
- **Type Checking**: Determines if it's an Error log or Access log.
- **Regex Mapping**: For Access logs, it extracts IP, Timestamp, and Status.
- **Style Assignment**: Applies CSS classes based on status codes (e.g., `text-green-300` for 2xx status).

---

## 5. Logic Flow Overview (Function Chain)

1. **User Interaction**: User clicks "View" OR scrolls to bottom of terminal.
2. **Event Trigger**: [handleSelectLog](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/WebservreLogs.tsx#127-132) (Parent) OR `handleScroll` (LogTerminal).
3. **Execution**: `fetchlogs()` is called with `scroll_count`.
4. **Redux Dispatch**: `dispatch(getNginxLog())` OR `dispatch(getApacheLog())`.
5. **API Request**: Server returns log array.
6. **Redux Fulfilled**: [extraReducers](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/redux/slice/websiteSlice.ts#265-341) appends logs to state.
7. **UI Component Update**: `useAppSelector` in [LogTerminalModal](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#52-362) detects change.
8. **Final Render**: [formatLog()](file:///Users/gadgetzone/Desktop/CloudStick/cloudstick_v2/src/components/WEBAPPComponets/WebServerLogs/LogTerminal.tsx#151-251) maps the new data to the terminal display.

---

## 6. API Flow Table

| Action | Redux Thunk | Endpoint | Parameters |
| :--- | :--- | :--- | :--- |
| **View Nginx Logs** | `getNginxLog` | `/api/v2/nginx-logs/...` | `scroll_count`, `log=access|error` |
| **View Apache Logs** | `getApacheLog` | `/api/v2/apache-logs/...` | `scroll_count`, `log=access|error` |

---

## 6. Component Property Mapping

```typescript
// Data flow from WebServerLogs -> LogTerminalModal
<LogTerminalModal
  isOpen={isModalOpen}              // Controls visibility
  selectedLogType={selectedLogType} // The current active log (e.g., 'nginx-access')
  logTypeTabInfo={logTypeTabInfo}   // List of available tabs
  fetchlogs={fetchlogs}             // Callback to trigger Redux thunks
  currentLogData={ReduxState}      // Fetched logs and total count (via Selector)
/>
```
