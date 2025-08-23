import React from "react";
import type { FC, ReactNode } from "react";
import type { Account } from "../types";
export declare const ConnectionStatusContext: React.Context<{
    isConnected: boolean;
    accounts: Account[];
    setAccounts: (accounts: Account[]) => void;
} | null>;
export declare const ConnectionStatusProvider: FC<{
    children: NonNullable<ReactNode>;
}>;
