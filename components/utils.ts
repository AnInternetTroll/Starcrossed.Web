/**
 * Hash any string with sha-256
 * @param message The string to be sha-256 hashed
 * @returns The hash
 */
export async function sha256(message: string): Promise<string> {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message);
	// hash the message
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	// convert bytes to hex string
	const hashHex = hashArray
		.map((b) => ("00" + b.toString(16)).slice(-2))
		.join("");
	return hashHex;
}

export function setItem(name: string, value: string) {
	localStorage.setItem(name, value);
	return value;
}

export function getItem(name: string) {
	return localStorage.getItem(name);
}

export class Api {
	static base_url: string = process.env.base_url;

	/**
	 * Execute and return a GraphQL query
	 * @param query A GraphQL formatted query
	 * @returns The api response
	 */
	static async graphql(
		query: string
	): Promise<{ data?: any; error?: any; code: number }> {
		const token = getItem("token");
		const basic = getItem("basic");
		const res = await fetch(`${this.base_url}/graphql`, {
			method: "POST",
			headers: {
				authorization: token
					? `Bearer ${token}`
					: basic
					? `Basic ${basic}`
					: "",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		});
		const data = await res.json();
		if (res.ok) return { data: data.data, error: null, code: res.status };
		else {
			for (let i = 0; i < data.errors.length; i++) {
				if (data.errors[i].extensions.code === "TOKEN_EXPIRE") {
					this.login();
					return this.graphql(query);
				}
			}
			return { data: null, error: data.error, code: res.status };
		}
	}

	static async login(username?: string, password?: string) {
		let basic: string;
		if (username && password) {
			basic = setItem(
				"basic",
				btoa(`${username}:${await sha256(password)}`)
			);
		} else basic = getItem("basic");
		const res = await fetch(`${this.base_url}/auth/token`, {
			headers: {
				authorization: basic ? `Basic ${basic}` : "",
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		if (res.ok) {
			setItem("token", data.token);
			return { data, status: res.status, statusText: res.statusText };
		} else return { data, status: res.status, statusText: res.statusText };
	}
}
