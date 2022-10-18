export type RequestMethod  = "GET" | "PUT" | "POST" | "DELETE"

async function req(path: string, params?: string, method: RequestMethod = "GET", body?: string, customHeaders?: HeadersInit) : Promise<Response | string | boolean> {
  try {
    const csrfToken = document.querySelector('[name="csrf-token"]')?.getAttribute("content");

    const url: RequestInfo = params ? `${path}?${params}` : path;
    
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      accept: "application/json",
      "X-CSRF-TOKEN": csrfToken ?? "",
    }
  
    const headers = customHeaders ? {...defaultHeaders, ...customHeaders} : defaultHeaders;
    
    const options: RequestInit = {
      method: method,
      headers: headers,
    }
  
    if (body) {
      options["body"] = body
    }

    const res = await fetch(url, options);
    
    if (!res.ok) {
      throw new Error(`(${res.status}):[${res.url}]:${res.statusText}`);
    }

    const resType = res.headers.get("Content-Type") ?? "";

    if (resType.includes("html")) {
      return res.text();
    }

    if (resType.includes("json")) {
      return res.json();
    }

    return res.ok;

  } catch (error) {
    console.error(error);
    return error as Response;
  }
}

function createPage(parent_id: number, name: string, slug: string) {
  return req(`/fs/pages/drafts`, undefined, "POST", JSON.stringify({
    parent_id, name, slug
  }));
}

function publishPage(id: number, options?: URLSearchParams) {
  const params = options ? new URLSearchParams(options).toString() : undefined;
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
  })
  return req(`/fs/pages/drafts/${id}/publish`, params, "PUT", undefined, headers)
}

function getPageDraftHTML(id: number) {
  const headers = {"Content-Type": "text/html; charset=utf-8", accept: "text/html"}
  return req(`/fs/pages/drafts/${id}?`, undefined, "GET", undefined, headers)
}

function getPageElementsFromHTML(html: string) {
  const regex = /fsElement.*?id="fsEl_(\d*).*?data-settings-id="(\d*)/gmi;
  let match: RegExpExecArray | null;
  let pageElements = [];
  while ((match = regex.exec(html)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    pageElements.push({id: match[1], settings_id: match[2]})
  }
  return pageElements;
}

function getFormsPermissions() {
  return req(`/fs/form-manager/permissions`)
}

function getLocationsPermissions() {
  return req(`/fs/location-manager/permissions`)
}

function getMessagesPermissions() {
  return req(`/fs/comms-manager/permissions`);
}

function getPagePopsPermissions() {
  return req(`/fs/page-pops-permissions`);
}

function getPostsPermissions() {
  return req(`/fs/post-manager/permissions`);
}

function getWorkflowsPermissions() {
  return req(`/fs/workflow-manager/permissions`);
}

function getSocialMediaConnectionsPermissions() {
  return req(`/fs/social-media-manager/permissions`);
}

function getCrisisModePermissions() {
  return req(`/fs/crisis-manager/permissions`);
}

function getComposerPermissions() {
  return req(`/fs/composer/permissions`)
}

async function run() {
  const composer = await getComposerPermissions();
  const forms = await getFormsPermissions();
  const locations = await getLocationsPermissions();
  const posts = await getPostsPermissions();
  const messages = await getMessagesPermissions();
  const pagepops = await getPagePopsPermissions();
  const workflows = await getWorkflowsPermissions();
  const socialmedia = await getSocialMediaConnectionsPermissions();
  const crisismode = await getCrisisModePermissions();
  console.log({
    composer, forms, locations, posts, messages, pagepops, workflows, socialmedia, crisismode
  })
}

run();