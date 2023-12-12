export type refreshTokensMetaType = {
	userId: string
	deviceId: string
	deviceName: string
	Ip: string
	usedAt: Date
}

export const refreshTokensMetaRepository = {
	async createRefreshToken(UserId: string) {},
}
