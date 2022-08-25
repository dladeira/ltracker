import { useMediaQuery } from "react-responsive"

function Component({ children }) {
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    const style = {
        display: "grid",
        gap: "20px",
        gridTemplateRows: "repeat(3, 1fr)",
        gridTemplateColumns: "repeat(4, 1fr)",
        width: "100%",
        height: "calc(100% - 110px)"
    }

    if (isMobile) {
        style.gridTemplateRows = "repeat(auto-fill, 250px)"
        style.gridTemplateColumns = "1fr"
        style.height = "100%"
    }

    return (
        <div style={style}>
            {children}
        </div >
    )
}

export default Component