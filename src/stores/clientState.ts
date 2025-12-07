import {defineStore} from "pinia";


interface ClientState {
    loading: boolean
}

export const useClientStore = defineStore('clientState', {
    state: (): ClientState => ({
        loading: false,
    }),
    actions: {
        setLoading(val: boolean){
            this.loading = val;
        }
    }
});