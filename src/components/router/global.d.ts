interface RouteChangeDetail {
  path: string;
}

declare global {
  interface WindowEventMap {
    'routechange': CustomEvent<RouteChangeDetail>;
  }
  interface HTMLElementEventMap {
    'routechange': CustomEvent<RouteChangeDetail>;
  }
}

export {}; 