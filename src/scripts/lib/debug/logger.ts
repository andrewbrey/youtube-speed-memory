import { DEBUG_ENABLED } from '@global/env';
import { format } from 'date-fns';

export class DebugLogger {
	private clazz = this.constructor.name;

	constructor(clazz: string) {
		this.clazz = clazz;
	}

	static for(clazz: string) {
		return new DebugLogger(clazz);
	}

	log(what: any) {
		if (DEBUG_ENABLED) {
			// tslint:disable-next-line:no-console
			console.log(
				`%c${this.clazz}%c [${format(new Date(), 'hh:mm:ss.SSS a')}]`,
				'font-weight:bold;background-color:#254e53;padding:0 1rem;border-radius:3px;',
				'color:#aaa'
			);
			// tslint:disable-next-line:no-console
			console.log('  ', what);
		}
	}

	debug(what: any) {
		if (DEBUG_ENABLED) {
			// tslint:disable-next-line:no-console
			console.debug(
				`%c${this.clazz}%c [${format(new Date(), 'hh:mm:ss.SSS a')}]`,
				'font-weight:bold;background-color:#5522aa55;padding:0 1rem;border-radius:3px;border:1px solid white;',
				'color:#aaa'
			);
			// tslint:disable-next-line:no-console
			console.debug('  ', what);
		}
	}

	error(what: any) {
		if (DEBUG_ENABLED) {
			// tslint:disable-next-line:no-console
			console.log(
				`%c${this.clazz}%c [${format(new Date(), 'hh:mm:ss.SSS a')}]`,
				'font-weight:bold;background-color:#942A00;padding:0 1rem;border-radius:3px;',
				'color:#aaa'
			);
			// tslint:disable-next-line:no-console
			console.log('  ', what);
		}
	}
}
