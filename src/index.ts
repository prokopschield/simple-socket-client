import { io } from 'socket.io-client';

export function createClient<
	T extends Record<string, (...args: any[]) => Promise<any>>
>(endpoint: string): T {
	const socket = io(endpoint);
	const target = {} as T;

	return new Proxy(target, {
		get(_target, key) {
			return (...args: any[]) => {
				return new Promise((resolve) => {
					socket.emit(String(key), ...args, resolve);
				});
			};
		},
	});
}
