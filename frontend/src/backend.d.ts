import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ChatMessageEntry {
    from: string;
    message: string;
    timestamp: Time;
}
export interface Appointment {
    id: bigint;
    service: string;
    customerName: string;
    status: AppointmentStatus;
    date: Time;
    time: string;
    description: string;
    phoneNumber: string;
    chatHistory: Array<ChatMessageEntry>;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppointment(appointment: Appointment): Promise<void>;
    deleteAppointment(): Promise<void>;
    getAppointments(): Promise<Array<Appointment>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    updateAppointment(appointment: Appointment): Promise<void>;
}
