/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface AppCreateAccount {
    }
    interface AppHome {
    }
    interface AppLogin {
    }
    interface AppRoot {
    }
    interface CompLoading {
    }
    interface CompPageMenuPattern {
        "titlePage": string;
    }
    interface CompPermission {
    }
}
declare global {
    interface HTMLAppCreateAccountElement extends Components.AppCreateAccount, HTMLStencilElement {
    }
    var HTMLAppCreateAccountElement: {
        prototype: HTMLAppCreateAccountElement;
        new (): HTMLAppCreateAccountElement;
    };
    interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {
    }
    var HTMLAppHomeElement: {
        prototype: HTMLAppHomeElement;
        new (): HTMLAppHomeElement;
    };
    interface HTMLAppLoginElement extends Components.AppLogin, HTMLStencilElement {
    }
    var HTMLAppLoginElement: {
        prototype: HTMLAppLoginElement;
        new (): HTMLAppLoginElement;
    };
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLCompLoadingElement extends Components.CompLoading, HTMLStencilElement {
    }
    var HTMLCompLoadingElement: {
        prototype: HTMLCompLoadingElement;
        new (): HTMLCompLoadingElement;
    };
    interface HTMLCompPageMenuPatternElement extends Components.CompPageMenuPattern, HTMLStencilElement {
    }
    var HTMLCompPageMenuPatternElement: {
        prototype: HTMLCompPageMenuPatternElement;
        new (): HTMLCompPageMenuPatternElement;
    };
    interface HTMLCompPermissionElement extends Components.CompPermission, HTMLStencilElement {
    }
    var HTMLCompPermissionElement: {
        prototype: HTMLCompPermissionElement;
        new (): HTMLCompPermissionElement;
    };
    interface HTMLElementTagNameMap {
        "app-create-account": HTMLAppCreateAccountElement;
        "app-home": HTMLAppHomeElement;
        "app-login": HTMLAppLoginElement;
        "app-root": HTMLAppRootElement;
        "comp-loading": HTMLCompLoadingElement;
        "comp-page-menu-pattern": HTMLCompPageMenuPatternElement;
        "comp-permission": HTMLCompPermissionElement;
    }
}
declare namespace LocalJSX {
    interface AppCreateAccount {
    }
    interface AppHome {
    }
    interface AppLogin {
    }
    interface AppRoot {
    }
    interface CompLoading {
    }
    interface CompPageMenuPattern {
        "titlePage"?: string;
    }
    interface CompPermission {
    }
    interface IntrinsicElements {
        "app-create-account": AppCreateAccount;
        "app-home": AppHome;
        "app-login": AppLogin;
        "app-root": AppRoot;
        "comp-loading": CompLoading;
        "comp-page-menu-pattern": CompPageMenuPattern;
        "comp-permission": CompPermission;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-create-account": LocalJSX.AppCreateAccount & JSXBase.HTMLAttributes<HTMLAppCreateAccountElement>;
            "app-home": LocalJSX.AppHome & JSXBase.HTMLAttributes<HTMLAppHomeElement>;
            "app-login": LocalJSX.AppLogin & JSXBase.HTMLAttributes<HTMLAppLoginElement>;
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "comp-loading": LocalJSX.CompLoading & JSXBase.HTMLAttributes<HTMLCompLoadingElement>;
            "comp-page-menu-pattern": LocalJSX.CompPageMenuPattern & JSXBase.HTMLAttributes<HTMLCompPageMenuPatternElement>;
            "comp-permission": LocalJSX.CompPermission & JSXBase.HTMLAttributes<HTMLCompPermissionElement>;
        }
    }
}
