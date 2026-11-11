// ContextHQ SDK — Client
// Typed client for consuming wallet context from the ContextHQ API

import {
  WalletContext,
  ContextAPIResponse,
  ContextHQConfig,
  ChainActivity,
} from "./types";

export class ContextHQ {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ContextHQConfig) {
    if (!config.apiKey) {
      throw new Error("ContextHQ: apiKey is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || "https://contexthq.vercel.app").replace(
      /\/$/,
      ""
    );
  }

  /**
   * Get full AI-analyzed wallet context
   */
  async getContext(address: string): Promise<WalletContext> {
    const response = await this._request(address);
    if (!response.ok || !response.data) {
      throw new Error(
        response.error?.message || "Failed to fetch wallet context"
      );
    }
    return response.data;
  }

  /**
   * Get risk assessment for a wallet
   */
  async getRiskProfile(
    address: string
  ): Promise<WalletContext["risk"]> {
    const context = await this.getContext(address);
    return context.risk;
  }

  /**
   * Get chain activity for a wallet
   */
  async getChainActivity(address: string): Promise<ChainActivity[]> {
    const context = await this.getContext(address);
    return context.chains;
  }

  /**
   * Get wallet identity classification
   */
  async getIdentity(
    address: string
  ): Promise<WalletContext["summary"]> {
    const context = await this.getContext(address);
    return context.summary;
  }

  /**
   * Get raw API response (includes metadata)
   */
  async getRawResponse(address: string): Promise<ContextAPIResponse> {
    return this._request(address);
  }

  private async _request(address: string): Promise<ContextAPIResponse> {
    const url = `${this.baseUrl}/api/v1/context?address=${encodeURIComponent(address)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => ({}))) as any;
      return {
        ok: false,
        error: {
          code: errorBody?.error?.code || `HTTP_${response.status}`,
          message:
            errorBody?.error?.message ||
            `Request failed with status ${response.status}`,
        },
        meta: {
          version: "1.0",
          generatedAt: new Date().toISOString(),
          source: "contexthq-sdk",
        },
      };
    }

    return (await response.json()) as ContextAPIResponse;
  }
}
