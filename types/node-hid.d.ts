import 'node-hid'
import * as NodeHid from 'node-hid'

declare module 'node-hid' {
	class HIDv2 extends NodeHid.HID {
		getDeviceInfo(): { manufacturer: string; product: string; serialNumber: string; }
	} 	
}
