import type { CertId, CertMeta } from "./types";

export const CERTS: Record<CertId, CertMeta> = {
  cka: {
    id: "cka",
    name: "Certified Kubernetes Administrator",
    shortName: "CKA",
    provider: "CNCF / Linux Foundation",
    tagline: "Operate production-grade Kubernetes clusters.",
    color: "#326ce5",
    featured: true,
  },
  "aws-saa": {
    id: "aws-saa",
    name: "AWS Solutions Architect Associate",
    shortName: "AWS SAA-C03",
    provider: "Amazon Web Services",
    tagline: "Design resilient, secure, cost-optimized architectures on AWS.",
    color: "#ff9900",
    featured: true,
  },
  "aws-clf": {
    id: "aws-clf",
    name: "AWS Certified Cloud Practitioner",
    shortName: "AWS CLF-C02",
    provider: "Amazon Web Services",
    tagline: "Cloud concepts, AWS services, billing, and shared responsibility.",
    color: "#ec7211",
    featured: true,
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

/** Dashboard order: top cloud/Kubernetes exams first. */
export const CERT_ORDER: CertId[] = [
  "cka",
  "aws-saa",
  "aws-clf",
  "az104",
  "securityplus",
];

const CERT_IDS = new Set<string>(CERT_ORDER);

export function isCertId(value: string): value is CertId {
  return CERT_IDS.has(value);
}
