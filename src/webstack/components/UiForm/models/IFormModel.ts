import { IRoute } from "@shared/components/Navbar/data/routes";
import { IVariant } from "@webstack/components/AdapTable/models/IVariant";
import { ITraits } from "@webstack/components/FormControl/FormControl";
import { UserAddress } from "~/src/models/UserContext";

export type IFormMinMax = {
    value?: number;
    message?: string;
};
export type OForm = {
    fields?: {[key: string]: any;}
} | boolean | string;

export type IFormField = {
    name: string;
    error?: string;
    options?: (string | IRoute | number)[] | React.ReactElement[];
    width?: string;
    value?: string | boolean | UserAddress | number;
    label?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    type?: string;
    traits?: ITraits;
    variant?: IVariant;
    required?: boolean;
    disabled?: boolean;
    constraints?: {
        min?: IFormMinMax | number;
        max?: IFormMinMax | number;
        required?: boolean | {
            message?: string
        };
    }
}

export interface IForm {
    traits?: ITraits;
    variant?: IVariant;
    disabled?: boolean;
    loading?: OForm;
    fields?: IFormField[];
    title?: string | React.ReactElement;
    btnText?: string | React.ReactElement;
    onChange?: (e: any) => void;
    onSubmit?: (e: any) => void;
    onError?: (e: any) => void;
    collapse?: boolean;
}