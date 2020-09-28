declare module "soundex" {
    declare module.exports: (str: string, scale?: boolean, mysql?: boolean) => string;
}