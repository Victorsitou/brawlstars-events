export const fetcher = async (url: string, options?: RequestInit) => {
    return await fetch(url, options).then(res => res.json())
}