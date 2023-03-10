import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import api from './api';

const App: Component = () => {
    onMount(() => {
        api.user({})
            .then((data) => {
                console.log({ data });
                if (data.logged) {
                    data.user.role == 'moderator';
                }
            })
            .catch((error) => {
                console.log('ERR', error);
            });
    });

    return (
        <div class="App">
            <header class="header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
            </header>
        </div>
    );
};

export default App;
