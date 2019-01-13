/* @flow */

import type TypeContext from '../../../TypeContext';

export function pass (t: TypeContext) {
  const IdMap = t.type("IdMap", IdMap => {
    const T = IdMap.typeParameter("T");
    return t.object(t.indexer("id", t.string(), T));
  });

  const Payment = t.type(
    "Payment",
    t.object(
      t.property("payment_id", t.string()),
      t.property("invoice_id", t.string())
    )
  );

  const Invoice = t.type(
    "Invoice",
    t.object(
      t.property("invoice_id", t.string()),
      t.property("payments", t.ref(IdMap, Payment), true)
    )
  );

  const InvoicingState = t.type(
    "InvoicingState",
    t.object(t.property("invoices", t.ref(IdMap, Invoice)))
  );

  const INVOICES = t.array(Invoice).assert([
    {
      invoice_id: "invoice-1"
    },
    {
      invoice_id: "invoice-2"
    },
    {
      invoice_id: "invoice-3"
    }
  ]);

  const PAYMENT_1 = Payment.assert({
    payment_id: "payment-1",
    invoice_id: "invoice-1"
  });

  Payment.assert({
    payment_id: "payment-2",
    invoice_id: "invoice-2"
  });

  const toIdMap = t.annotate(
    function toIdMap(idName, xs) {
      const T = t.typeParameter("T");

      let _idNameType = t.string();

      let _xsType = t.array(t.flowInto(T));

      const _returnType = t.return(t.ref(IdMap, T));

      t.param("idName", _idNameType).assert(idName);
      t.param("xs", _xsType).assert(xs);

      const obj = {};
      for (let i = 0; i < xs.length; i++) {
        const id = t.array(t.any()).assert(xs)[i][idName];
        obj[id] = xs[i];
      }
      return _returnType.assert(obj);
    },
    t.function(_fn => {
      const T = _fn.typeParameter("T");

      return [
        t.param("idName", t.string()),
        t.param("xs", t.array(t.flowInto(T))),
        t.return(t.ref(IdMap, T))
      ];
    })
  );

  const state = InvoicingState.assert({
    invoices: {}
  });

  const setInvoices = t.annotate(function setInvoices(state, is) {
    let _stateType = InvoicingState;

    let _isType = t.array(Invoice);

    t.param("state", _stateType).assert(state);
    t.param("is", _isType).assert(is);

    state.invoices = toIdMap("invoice_id", is);
  }, t.function(
    t.param("state", InvoicingState),
    t.param("is", t.array(Invoice))
  ));

  const addPayment = t.annotate(function addPayment(state, p) {
    let _stateType2 = InvoicingState;
    let _pType = Payment;
    t.param("state", _stateType2).assert(state);
    t.param("p", _pType).assert(p);

    const invoice = state.invoices[p.invoice_id];

    if (invoice.payments) {
      invoice.payments[p.payment_id] = p;
    } else {
      invoice.payments = {
        [p.payment_id]: p
      };
    }
  }, t.function(t.param("state", InvoicingState), t.param("p", Payment)));

  setInvoices(state, INVOICES);
  addPayment(state, PAYMENT_1);
  addPayment(state, PAYMENT_1);

  return true;
}
