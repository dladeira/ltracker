import { useMediaQuery } from "react-responsive"

function Component({ rowSpan = 1, colSpan = 1, title, children }) {
    const isMobile = useMediaQuery({ query: '(max-width: 700px)' })

    const classNames = "h-full w-full bg-white rounded-lg p-3.5 pt-1"
    if (!isMobile) {
        classNames+= " row-span-" + rowSpan
        classNames+= " col-span-" + colSpan
    }

    return (
        <div className={classNames}>
            <h3 className="text-lg font-medium">{title}</h3>
            {children}
        </div >
    )
}

export default Component