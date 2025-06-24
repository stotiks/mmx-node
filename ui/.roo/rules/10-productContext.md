# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-06-12 18:44:26 - Log of updates made will be appended as footnotes to the end of this file.

*

## Project Goal

*   A Vue.js application with Quasar framework that provides a web interface for interacting with MMX node. The application includes features for wallet management, blockchain exploration, farming, node management, and decentralized exchange (swap). It also has a browser extension component (BEX) for wallet integration with websites.

## Key Features

*   **Core Application**: Built with Vue.js 3, Quasar, Vue Router, Pinia, and TanStack Query. Supports multiple build targets (GUI, EXPLORER, OFFLINE, PLAYGROUND).
*   **Wallet Implementation**: Custom ECDSA wallet implementation in JavaScript for transaction creation and signing.
*   **Browser Extension (BEX)**: Provides wallet functionality to websites with a secure vault and permission system.
*   **API Communication**: Uses Axios to communicate with MMX node via WAPI endpoints.
*   **UI Components**: Multiple pages and reusable components with i18n support.

## Overall Architecture

*   The application is a client-side web application that communicates with a backend MMX node. It's structured with a clear separation of concerns, including a core application, a BEX component, and a detailed wallet implementation.
