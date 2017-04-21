//noinspection TypeScriptUnresolvedVariable
// export interface Promise<Value> extends P.Promise<Value> { }

export function parent(event){
  return event.data.ref.parent;
}