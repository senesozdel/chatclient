import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const dateFormatter = {
    
    toISOString: (date = new Date()) => {
        return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    },
    toTimeDay: (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'EEEE HH:mm', { locale: tr });
    },
    toShortTime: (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'HH:mm', { locale: tr });
    },
    toDayOnly: (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'EEEE', { locale: tr });
    },
    toFullDate: (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'd MMMM yyyy, EEEE HH:mm', { locale: tr });
    }
};
