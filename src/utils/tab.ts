import {computed, ComputedRef, Ref, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Tab} from "bootstrap";

export interface TabManager{
    init: () => Promise<void>,
    loaded: (key: string) => ComputedRef<boolean>,
}

export default function useTab(): TabManager{
    const route = useRoute();
    const router = useRouter();

    // A ref to keep track of which tabs have been loaded.
    const loaded_tabs: Ref<string[]> = ref([]);

    async function init(): Promise<void> {
        const tabs = document.querySelectorAll("a[role='tab']");
        if (tabs.length === 0) {
            return; // No tabs found, do nothing.
        }
        const first_tab = tabs[0];
        const tab_table: {[key: string]: HTMLElement} = {};

        // Create a mapping from tab target ID (e.g., '#profile') to the tab element
        // and add click listeners to sync the URL hash with the active tab.
        for (const tab of tabs){
            if (tab instanceof HTMLElement){
                const tab_target = tab.dataset["bsTarget"];
                if (tab_target) {
                    tab_table[tab_target] = tab;
                    tab.addEventListener("click", async function (){
                        // When a tab is clicked, update the URL hash to match the tab's target.
                        loaded_tabs.value.push(tab_target);
                        await router.replace(tab_target);
                    })
                }
            }
        }

        // On initial load, check if the URL hash corresponds to a valid tab.
        if (route.hash && (route.hash in tab_table)){
            const cur_tab = tab_table[route.hash];
            // Show the tab using Bootstrap's Tab API.
            Tab.getOrCreateInstance(cur_tab).show();
        } else if (first_tab instanceof HTMLElement){
            const first_tab_target = first_tab.dataset["bsTarget"];
            if (first_tab_target) {
                Tab.getOrCreateInstance(first_tab).show();
                await router.replace(first_tab_target);
            }
        }
    }

    function loaded(tab: string){
        return computed(()=>loaded_tabs.value.includes(tab));
    }

    return {
        init: init,
        loaded: loaded,
    };
}
