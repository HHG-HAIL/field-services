# Field Services – Copilot Instructions

## Big picture
- Monorepo hosts the React UI in `field-service-app/` plus three Spring Boot services (`work-order-service`, `technician-service`, `schedule-service`).
- Services run on fixed ports (8081/8082/8083) with in-memory H2 DBs and expose Swagger at `/swagger-ui.html`; keep CORS origin patterns aligned with the React dev server on :3000.
- `restart-backend.ps1` configures Java 17 + Maven, rebuilds each service, then launches them in separate shells—prefer that script for a clean rebuild/start cycle on Windows.

## Frontend essentials
- `src/hooks/useApiWithFallback.ts` probes the work-order API; if it fails, mock data from `data/mockData.ts` is kept live. Always use the `api.workOrders` / `api.technicians` helpers it returns so offline fallback stays coherent.
- REST endpoints and the SockJS/STOMP websocket entrypoint come from `config/api.ts`; when backend URLs change, update that map and keep `WS_ENDPOINT` using `http` (SockJS upgrades internally).
- Transport adapters in `services/*.ts` translate between backend payloads and frontend types (status enums, technician IDs, location strings). Reuse those helpers for any new API surface instead of calling `fetch` directly.
- Real-time updates flow through `hooks/useWebSocket.ts` and `window` events dispatched in `config/api.ts`; if you add topics, wire them there and in the backend `SimpMessagingTemplate` broadcasts.

## Backend services
- `work-order-service` owns work-order CRUD, technician assignment, and STOMP notifications. Controllers speak in `WorkOrderDTO`; `WorkOrderService` is the only layer touching entities, and all cross-service calls happen through `client/TechnicianClient` (RestTemplate to port 8082).
- Assignment/unassignment updates technician status via that client—if you change status enums, adjust both `TechnicianClient` and the frontend mapper (`mapFrontendToBackendStatus`).
- `technician-service` provides status/skill/location filtering with JPA queries in `TechnicianRepository`; DTOs mirror entities and enforce validation. Keep `Technician.Status` uppercase and remember phone numbers are stored as `phoneNumber`.
- `schedule-service` is mostly a stub exposing `ScheduleEntry`; extend it by adding service/repository layers following the DTO-first pattern used elsewhere.

## Data contracts & mapping
- Frontend status strings (`pending`, `in-progress`, etc.) are lower-case; backend enums are uppercase. The conversion lives in `services/workOrderService.ts` and `technicianService.ts`—extend those switches when introducing new states.
- Backend `location` is a simple string, while the UI expects `{ address, coordinates }`; `workOrderService.transformWorkOrder` injects defaults, so supply an address string from the backend.
- Technician availability drives UI badges and assignment rules; mock technicians seed `activeWorkOrders`, but the backend currently recalculates availability from status only—account for that before trusting counts.

## Local workflows
- **Backend build/tests:** `mvn clean install` inside each service (or run `restart-backend.ps1`). Fast unit tests via `mvn test` in the target module.
- **Frontend dev:** from `field-service-app`, run `npm install` once, then `npm start` (CRA dev server on :3000) or `npm test` for the Jest watcher.
- Swagger docs live at `http://localhost:808{1|2|3}/swagger-ui.html`; STOMP topics are broadcast from `work-order-service` at `/topic/workorders*` and subscribed by the React app.

## Conventions & tips
- Stick to the DTO → Service → Repository layering already in place; controllers should never return JPA entities directly.
- When adding cross-service calls, place them under `work-order-service/src/main/java/.../client/` beside `TechnicianClient` and wrap RestTemplate calls with error handling that fails soft (logging but not breaking assignments).
- Update `documentation/backend/API_DOCUMENTATION.md` if you alter public endpoints, and reflect any new mock behaviour in `data/mockData.ts` so offline mode stays consistent.
- Before assuming backend reachability in UI features, gate logic behind `isBackendAvailable` from `useApiWithFallback`; this keeps the demo usable without the Java stack running.
