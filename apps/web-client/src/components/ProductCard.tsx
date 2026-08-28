import { UI_CONFIG } from '../config/ui-config';

export const ProductCard = (props: any) => {
  const Component = UI_CONFIG.getProductCardComponent();
  return <Component {...props} />;
};