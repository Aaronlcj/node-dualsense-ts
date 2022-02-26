import { Device, devices, HIDv2 } from 'node-hid'

export class DualSense {
    verbose: boolean
    controller: HIDv2 | undefined
 	constructor(verbose = false) {
        this.verbose = verbose

        try {
            this.controller = new HIDv2(this.getDevice()?.path!)
            if (this.verbose && this.controller) {
                console.log('[contructor]', this.controller?.getDeviceInfo())
            }
        }
        catch(e) {
            console.log(`Error initializing: ${(e as Error).message}`)
        }
 	}

    getDevice(): Device | undefined {
        const device = devices().find(({ productId, vendorId }) => productId === 3302 && vendorId === 1356)

		if (!device) {
			throw new Error('No controller detected')
		}

        return device
    }

 	close(): void {
 		this.controller?.close()
 	}
	
	on(type: any, callback: any) {
		if (!['data', 'error'].includes(type)) {
			throw new Error('invalid type')
		}

		if (this.verbose) {
			console.log(`[on][${type}] add callback`)
		}

		return this.controller?.on(type, callback)
	}

	sendData(data: any) {
		if (this.verbose) {
			console.log(`[sendData]`, data)
		}

		return this.controller?.write(data)
	}

	call(data: any, sendData: any) {
		const packets = new Array(48).fill(0)
		for (const i in data) {
			const [index, value] = data[i]
			packets[index] = value
		}

		if (sendData) {
			return this.sendData(packets)			
		}

		return packets
	}

	setColor(r: number, g: number, b: number, sendData = true) {
		if( (r > 255 || g > 255 || b > 255) || (r < 0 || g < 0 || b < 0) ){
			throw new Error('Colors have values from 0 to 255 only')
		}

		return this.call([
			[0, 0x2],
			[2, 0x4],
			[45, r],
			[46, g],
			[47, b],
		], sendData)
	}
}