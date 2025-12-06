import {computed, ComputedRef, Ref, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Tab} from "bootstrap";

/**
 * Interface for the TabManager composable.
 */
export interface TabManager {
    /**
     * Initializes the tab functionality, linking Bootstrap tabs with Vue Router.
     */
    init: () => Promise<void>,
    /**
     * Returns a computed property that indicates if a tab has been loaded (i.e., clicked on at least once).
     * @param key The identifier for the tab (usually the hash target, e.g., '#profile').
     * @returns A ComputedRef<boolean> that is true if the tab has been loaded.
     */
    loaded: (key: string) => ComputedRef<boolean>,
}

/**
 * A Vue composable to manage Bootstrap tabs and synchronize them with the Vue Router hash.
 * This allows for deep-linking to specific tabs and maintaining tab state in the URL.
 *
 * @returns {TabManager} An object with methods to initialize and interact with the tabs.
 */
export default function useTab(): TabManager {
    const route = useRoute();
    const router = useRouter();

    const loaded_tabs: Ref<string[]> = ref([]);

    /**
     * Scans the DOM for tab elements, sets up click listeners, and shows the
     * correct tab based on the current URL hash or defaults to the first tab.
     */
    async function init(): Promise<void> {
        const tabs = document.querySelectorAll("a[role='tab']");
        if (tabs.length === 0) {
            return; // No tabs found, do nothing.
        }
        const first_tab = tabs[0];
        const tab_table: { [key: string]: HTMLElement } = {};

        for (const tab of tabs) {
            if (tab instanceof HTMLElement) {
                const tab_target = tab.dataset["bsTarget"];
                if (tab_target) {
                    tab_table[tab_target] = tab;
                    tab.addEventListener("click", async function () {
                        // Only add to loaded_tabs if it's not already there
                        if (!loaded_tabs.value.includes(tab_target)) {
                            loaded_tabs.value.push(tab_target);
                        }
                        await router.replace({hash: tab_target});
                    })
                }
            }
        }

        const currentHash = route.hash;
        if (currentHash && (currentHash in tab_table)) {
            const cur_tab = tab_table[currentHash];
            Tab.getOrCreateInstance(cur_tab).show();
            // Ensure the initial tab is marked as loaded
            if (!loaded_tabs.value.includes(currentHash)) {
                loaded_tabs.value.push(currentHash);
            }
        } else if (first_tab instanceof HTMLElement) {
            const first_tab_target = first_tab.dataset["bsTarget"];
            if (first_tab_target) {
                Tab.getOrCreateInstance(first_tab).show();
                // Mark the first tab as loaded
                if (!loaded_tabs.value.includes(first_tab_target)) {
                    loaded_tabs.value.push(first_tab_target);
                }
                await router.replace({hash: first_tab_target});
            }
        }
    }

    /**
     * Checks if a specific tab has been loaded.
     * @param tab The identifier for the tab (e.g., '#profile').
     * @returns A computed boolean ref.
     */
    function loaded(tab: string): ComputedRef<boolean> {
        return computed(() => loaded_tabs.value.includes(tab));
    }

    return {
        init: init,
        loaded: loaded,
    };
}
