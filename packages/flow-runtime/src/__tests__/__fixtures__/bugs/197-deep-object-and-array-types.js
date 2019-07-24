/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ItemType = t.type('ItemType', t.object(t.property('designation', t.string()), t.property('price', t.number(), true), t.property('weight', t.number(), true)));
  const ParcelType = t.type('ParcelType', ParcelType => {
    const CustomItemType = ParcelType.typeParameter('CustomItemType');
    return t.object(t.property('nbItems', t.number()), t.property('item', CustomItemType));
  });
  const ParcelsDeliveryType = t.type('ParcelsDeliveryType', ParcelsDeliveryType => {
    const CustomParcelType = ParcelsDeliveryType.typeParameter('CustomParcelType');
    return t.object(t.property('parcels', t.array(CustomParcelType)), t.property('country', t.string()));
  });


  const shirt = ItemType.assert({
    designation: 'shirt',
    price: 20,
    weight: 0.5
  });

  const freeGoodie = ItemType.assert({
    designation: 'goodie',
    weight: 0.01
  });

  return t.ref(ParcelsDeliveryType, t.ref(ParcelType, ItemType)).assert({
    country: 'FRANCE',
    parcels: [{
      nbItems: 2,
      item: shirt
    }, {
      nbItems: 1,
      item: freeGoodie
    }]
  });
}
