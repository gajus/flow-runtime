/* @flow */

import type TypeContext from "../../../TypeContext";

export function pass(t: TypeContext) {
  const Profile = t.type("Profile", t.string());
  const OnProfileReceived = t.type("OnProfileReceived", t.function(t.param("profile", Profile), t.param("clientID", t.string()), t.return(t.ref("Promise", t.void()))));

  async function callback(profile, clientID) {
    let _profileType = Profile;

    let _clientIDType = t.string();

    const _returnType = t.return(t.union(t.void(), t.ref("Promise", t.void())));

    t.param("profile", _profileType).assert(profile);
    t.param("clientID", _clientIDType).assert(clientID);

    await Promise.resolve();

    return _returnType.assert();
  }

  t.annotate(callback, t.function(t.param("profile", Profile), t.param("clientID", t.string()), t.return(t.ref("Promise", t.void()))));
  @t.annotate(t.class("Some", t.method("constructor", t.param("clientID", t.string()), t.param("onProfileReceived", OnProfileReceived))))
  class Some {
    constructor(clientID: *, onProfileReceived: * = t.annotate(
        (profile, clientID) => {
          let _profileType2 = Profile;

          let _clientIDType3 = t.string();

          const _returnType2 = t.return(t.void());

          t.param("profile", _profileType2).assert(profile);
          t.param("clientID", _clientIDType3).assert(clientID);
          return Promise.resolve().then(_arg => _returnType2.assert(_arg));
        },
        t.function(
          t.param("profile", Profile),
          t.param("clientID", t.string()),
          t.return(t.ref("Promise", t.void()))
        )
      )) {
      let _clientIDType2 = t.string();

      let _onProfileReceivedType = OnProfileReceived;
      t.param("clientID", _clientIDType2).assert(clientID);
      t
        .param("onProfileReceived", _onProfileReceivedType)
        .assert(onProfileReceived);

      // get profile here
      onProfileReceived('test', clientID);
    }
  }

  return new Some("a", callback);
}

export function fail(t: TypeContext) {
 const Profile = t.type("Profile", t.string());
 const OnProfileReceived = t.type("OnProfileReceived", t.function(t.param("profile", Profile), t.param("clientID", t.string()), t.return(t.ref("Promise", t.void()))));

 async function callback(profile, clientID) {
   let _profileType = Profile;

   let _clientIDType = t.string();

   const _returnType = t.return(t.union(t.void(), t.ref("Promise", t.void())));

   t.param("profile", _profileType).assert(profile);
   t.param("clientID", _clientIDType).assert(clientID);

   await Promise.resolve();

   return _returnType.assert();
 }
 t.annotate(callback, t.function(t.param("profile", Profile), t.param("clientID", t.string()), t.return(t.ref("Set", t.void()))));

 @t.annotate(t.class("Some", t.method("constructor", t.param("clientID", t.string()), t.param("onProfileReceived", OnProfileReceived))))
 class Some {
   constructor(clientID: *, onProfileReceived: * = t.annotate(
       (profile, clientID) => {
         let _profileType2 = Profile;

         let _clientIDType3 = t.string();

         const _returnType2 = t.return(t.void());

         t.param("profile", _profileType2).assert(profile);
         t.param("clientID", _clientIDType3).assert(clientID);
         return Promise.resolve().then(_arg => _returnType2.assert(_arg));
       },
       t.function(
         t.param("profile", Profile),
         t.param("clientID", t.string()),
         t.return(t.ref("Promise", t.void()))
       )
     )) {
     let _clientIDType2 = t.string();

     let _onProfileReceivedType = OnProfileReceived;
     t.param("clientID", _clientIDType2).assert(clientID);
     t
       .param("onProfileReceived", _onProfileReceivedType)
       .assert(onProfileReceived);

     // get profile here
     onProfileReceived("test", clientID);
   }
 }

 return new Some("a", callback);
}
