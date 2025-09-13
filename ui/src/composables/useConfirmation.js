export const useConfirmation = () => {
    const { t } = useI18n();
    const $q = useQuasar();

    const withConfirmation = (title, message, callback) => {
        return () => {
            $q.dialog({
                title: title,
                message: message,
                cancel: true,
                persistent: true,
            }).onOk(() => {
                callback();
            });
        };
    };

    return {
        withConfirmation,
    };
};