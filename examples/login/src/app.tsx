import { Body, zzHtmlComponent } from "@lizzi/template";

import "./app.css";
import { Link, Router } from "@lizzi/router";
import { zz } from "@lizzi/core";
import { If } from "@lizzi/node";

const data = [
  "entry-1",
  "entry-2",
  "entry-3",
  "entry-4",
  "entry-5",
  "entry-6",
  "entry-7",
  "entry-8",
  "entry-9",
  "entry-10",
  "entry-11",
  "entry-12",
  "entry-13",
  "entry-14",
  "entry-15",
  "entry-16",
  "entry-17",
  "entry-18",
  "entry-19",
  "entry-20",
  "entry-21",
];

class Pagenator {
  readonly pages = zz.Compute(() =>
    Math.ceil(this.total.value / this.perPage.value)
  );
  readonly prevPage = zz.Compute(() => this.page.value - 1);
  readonly nextPage = zz.Compute(() => this.page.value + 1);

  readonly hasPrev = zz.Compute(() => this.prevPage.value > 0);
  readonly hasNext = zz.Compute(() => this.nextPage.value <= this.pages.value);

  readonly start = zz.Compute(() => (this.page.value - 1) * this.perPage.value);
  readonly end = zz.Compute(() => this.start.value + this.perPage.value);

  constructor(
    readonly page: zz.Compute<number>,
    readonly perPage: zz.Compute<number>,
    readonly total: zz.Compute<number>
  ) {}
}

class Home extends zzHtmlComponent {
  constructor() {
    super();

    this.onMount(() => {
      const router = this.firstParent(Router);
      if (!router) throw new Error("Home must be inside Router");

      const page = zz.Compute(() =>
        parseInt(router.url.searchParams.get("page").value ?? "1")
      );

      const perPage = zz.Compute(() =>
        parseInt(router.url.searchParams.get("per_page").value ?? "5")
      );

      const total = zz.Compute(() => data.length);

      const pagenator = new Pagenator(page, perPage, total);

      const entries = zz.ComputeArray(() =>
        data.slice(pagenator.start.value, pagenator.end.value)
      );

      this.append(
        <>
          <div class="entries">
            {entries.map((entry) => (
              <div class="entry">{entry}</div>
            ))}
          </div>
          <div class="flex gap-2">
            <If condition={pagenator.hasPrev}>
              <Link
                search={{
                  page: pagenator.prevPage,
                  per_page: pagenator.perPage,
                }}
              >
                Prev
              </Link>
            </If>
            {pagenator.page} / {pagenator.pages}
            <If condition={pagenator.hasNext}>
              <Link
                search={{
                  page: pagenator.nextPage,
                  per_page: pagenator.perPage,
                }}
              >
                Next
              </Link>
            </If>
          </div>
        </>
      );
    });
  }
}

Body(
  <Router>
    <Home />
  </Router>
);
