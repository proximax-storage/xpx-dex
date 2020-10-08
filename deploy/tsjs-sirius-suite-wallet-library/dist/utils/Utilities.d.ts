export declare class Utilities {
    static showLogs: boolean;
    static logs(msg: any, msg2?: any): void;
    static buildNodeURL(url: string): string;
    static splitURL(url: string): {
        protocol: string;
        domainIp: string;
        port: string;
    };
    static validateURL(str: string): {
        protocol: string;
        domainIp: string;
        port: string;
    };
}
