/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const ItemsType = t.type("ItemsType", ItemsType => {
    const T = ItemsType.typeParameter("T");
    return t.object(t.property("items", t.array(T)));
  });
  const ItemType = t.type(
    "ItemType",
    t.object(t.property("name", t.nullable(t.string()), true))
  );
  const CheckType1 = t.type(
    "CheckType1",
    t.object(t.property("check", t.ref(ItemsType, ItemType)))
  );
  const CheckType2 = t.type(
    "CheckType2",
    t.object(
      t.property("check", t.object(t.property("items", t.array(ItemType))))
    )
  );

  const data = {
    check: {
      items: [{ name: null }, {}, { name: "3" }]
    }
  };

  CheckType1.assert(data);
  return CheckType2.assert(data);
}
