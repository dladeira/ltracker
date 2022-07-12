function Component({ children }) {
    const style = {
        display: "grid",
        gap: "20px",
        gridTemplateRows: "250px 250px 250px",
        gridTemplateColumns: "repeat(4, 370px)"
    }

    return (
        <div style={style}>
            {children}
        </div >
    )
}

export default Component