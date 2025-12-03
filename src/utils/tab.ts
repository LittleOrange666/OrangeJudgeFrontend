import {computed, ComputedRef, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Tab} from "bootstrap";

interface TabManager{
    init: () => Promise<void>,
    loaded: (tab: string) => ComputedRef<boolean>
}


export default function useTab(){
    const route = useRoute();
    const router = useRouter();

    // A ref to keep track of which tabs have been loaded.
    const loaded_tabs = ref([]);

    /**
     * @description Initializes the tab functionality.
     * It finds all tab elements with a 'role="tab"' attribute, sets up click listeners to update the URL hash,
     * and activates the correct tab based on the current URL hash. If the hash is invalid or not present,
     * it defaults to the first available tab.
     * @returns {Promise<void>}
     */
    async function init(){
        const tabs = document.querySelectorAll("a[role='tab']");
        if (tabs.length === 0) {
            return; // No tabs found, do nothing.
        }
        const first_tab = tabs[0];
        const tab_table = {};

        // Create a mapping from tab target ID (e.g., '#profile') to the tab element
        // and add click listeners to sync the URL hash with the active tab.
        for (const tab of tabs){
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

        // On initial load, check if the URL hash corresponds to a valid tab.
        if (route.hash && (route.hash in tab_table)){
            const cur_tab = tab_table[route.hash];
            // Show the tab using Bootstrap's Tab API.
            Tab.getOrCreateInstance(cur_tab).show();
        } else {
            // If no hash is present or the hash doesn't match any tab,
            // activate the first tab and update the URL hash.
            const first_tab_target = first_tab.dataset["bsTarget"];
            if (first_tab_target) {
                Tab.getOrCreateInstance(first_tab).show();
                await router.replace(first_tab_target);
            }
        }
    }


    function loaded(tab: string): ComputedRef<boolean>{
        return computed(()=>loaded_tabs.value.includes(tab));
    }

    return {
        init: init,
        loaded: loaded,
    };
}
