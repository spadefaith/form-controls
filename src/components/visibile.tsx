import { useMemo } from "preact/hooks";
import { isFalsy } from "../utils";


export default function Visible({ children, when }) {
    const isVisible = useMemo(() => !isFalsy(when), [when]);

    return isVisible ? children : null;
}