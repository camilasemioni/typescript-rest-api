export default interface Queries {
    [key: string]: { $regex: string; $options?: string };
}
