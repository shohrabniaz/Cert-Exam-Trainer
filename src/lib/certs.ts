import type { CertId, CertMeta } from "./types";

export const CERTS: Record<CertId, CertMeta> = {
  cka: {
    id: "cka",
    name: "Certified Kubernetes Administrator",
    shortName: "CKA",
    provider: "CNCF / Linux Foundation",
    tagline: "Operate production-grade Kubernetes clusters.",
    color: "#326ce5",
  },
  az104: {
    id: "az104",
    name: "Microsoft Azure Administrator",
    shortName: "AZ-104",
    provider: "Microsoft",
    tagline: "Manage identities, storage, compute and networking on Azure.",
    color: "#0078d4",
  },
  securityplus: {
    id: "securityplus",
    name: "CompTIA Security+",
    shortName: "Security+",
    provider: "CompTIA",
    tagline: "Core cybersecurity skills every practitioner needs.",
    color: "#e4002b",
  },
};

export const CERT_ORDER: CertId[] = ["cka", "az104", "securityplus"];

export function isCertId(value: string): value is CertId {
  return value === "cka" || value === "az104" || value === "securityplus";
}
