import { h } from 'preact';
import Visible from './visibile';
import { useMemo } from 'preact/hooks';
import { isFalsy } from '../utils';


export default function ControlLoader({ children, when }) {
    const isLoading = useMemo(() => !isFalsy(when), [when]);

    return <div style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '1fr max-content',
        alignContent: 'center',
        alignItems: 'center',
        gridGap: '4px'
    }}>

        {children}

        <Visible when={isLoading}>
            <div>
                <div class="spinner-border text-secondary spinner-border-sm" role="status">
                    <span class="visually-hidden"></span>
                </div>
            </div>
        </Visible>
    </div>
} 