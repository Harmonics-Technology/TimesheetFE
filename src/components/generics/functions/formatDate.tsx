import moment from 'moment';

export const formatDate = (date: any) => {
    return moment(date).format('MMM DD, YYYY');
};
