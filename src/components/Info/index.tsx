import { IconType } from "react-icons";
import commonStyles from '../../styles/common.module.scss'; 

interface InfoProps {
    icon: IconType,
    info: string
}

export default function Info({ icon: Icon, info }: InfoProps) {
    return (
        <div className={commonStyles.info}>
            <Icon color="#BBBBBB"/>
            <span>{info}</span>
        </div>

    )
}