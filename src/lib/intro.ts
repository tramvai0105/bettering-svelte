export async function timeWrap(func: () => void, delay: number = 0, duration: number = 0) {
    await new Promise<void>(res => setTimeout(() => {
        func()
        res();
    }, delay)
    )
    return new Promise<void>(res => setTimeout(() => { res() }, duration))
}

interface colorsList {
    font: string,
    bg: string,
}