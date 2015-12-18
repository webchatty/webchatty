// WebChatty
// Copyright (C) 2015 Andy Christianson, Brian Luft, Willie Zutz
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
// OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// <reference path="../../../../../typings/tsd.d.ts" />
"use strict";

import * as lodash from "lodash";
import * as api from "../../index";
import * as spec from "../../../spec/index";
import { Dictionary } from "../../../collections/index"; 

module.exports = (server: api.Server) => {
    server.addRoute(api.RequestMethod.Get, "/v2/getPost", async (req) => {
        const query = new api.QueryParser(req);
        const ids = query.getIntegerList("id", 1, 50, 1);
        const threadPosts = await server.threadConnector.getThreads(ids);
        const unnukedThreadPosts = api.removeNukedSubthreads(threadPosts);
        const postsById = Dictionary.fromArray(unnukedThreadPosts, x => x.id, x => x);
        return { 
            posts: lodash
                .chain(ids)
                .map(x => postsById.lookup(x, null))
                .filter(x => x !== null)
                .map(spec.postToHtml)
                .value() 
        };
    });
};
