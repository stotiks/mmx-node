MMX Node Web GUI - A Vue.js application with Quasar framework that provides a web interface for interacting with MMX nodes. The application includes features for wallet management, blockchain exploration, farming, node management, and decentralized exchange (swap). It also has a browser extension component (BEX) for wallet integration with websites.

Key components:

1. **Core Application**
   - Built with Vue.js 3 and Quasar framework
   - Uses Vue Router for navigation
   - Uses Pinia for state management
   - Uses TanStack Query for API data fetching
   - Supports multiple build targets: GUI, EXPLORER, OFFLINE, PLAYGROUND

2. **Wallet Implementation**
   - Custom ECDSA wallet implementation in JavaScript
   - Transaction creation and signing
   - Support for various operations: send, execute, deposit, etc.

3. **Browser Extension (BEX)**
   - Provides wallet functionality to websites
   - Secure vault for storing wallet seeds and addresses
   - Permission system for website access
   - Message handling system for communication between extension components

4. **API Communication**
   - Uses Axios for HTTP requests
   - Communicates with MMX node via WAPI endpoints
   - Supports different API endpoints based on configuration

5. **UI Components**
   - Multiple pages for different functionality (wallet, node, farmer, explorer, etc.)
   - Reusable components for common UI elements
   - i18n support for internationalization