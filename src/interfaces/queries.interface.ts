export default interface IQueries {
    [key: string]: { $regex: string; $options?: string };
}
