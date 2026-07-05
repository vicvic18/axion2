import { useState } from "react";
import { validators, totalValidators } from "../data/mockData";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

const ROWS_PER_PAGE = 10;

function ValidatorIcon({ name, color }: { name: string; color: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
}

export default function ValidatorsTableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(validators.length / ROWS_PER_PAGE);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const currentValidators = validators.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  return (
    <section id="validators" className="bg-[#0A0A0A] py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="animate-fade-in-up mb-6 text-2xl font-semibold text-white md:text-3xl">
          Validators
        </h2>

        {/* Table Container */}
        <div className="animate-fade-in-up stagger-2 overflow-hidden rounded-2xl border border-axion-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-axion-border">
                  <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">
                    <div className="flex items-center gap-1">
                      Validator
                      <Info className="h-3 w-3 text-axion-text-muted" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">
                    <div className="flex items-center gap-1">
                      Total BNB Staked
                      <Info className="h-3 w-3 text-axion-text-muted" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">
                    <div className="flex items-center gap-1">
                      Commission
                      <Info className="h-3 w-3 text-axion-text-muted" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">
                    <div className="flex items-center gap-1">
                      APY
                      <Info className="h-3 w-3 text-axion-text-muted" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-axion-text-tertiary">
                    <div className="flex items-center gap-1">
                      Status
                      <Info className="h-3 w-3 text-axion-text-muted" />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-axion-text-tertiary">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentValidators.map((validator, index) => (
                  <tr
                    key={validator.id}
                    className="border-b border-axion-border/50 transition-colors hover:bg-axion-bg-tertiary"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ValidatorIcon
                          name={validator.name}
                          color={validator.iconColor}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {validator.name}
                          </span>
                          <span className="inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-axion-text-tertiary">
                            {validator.tag}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-tabular">
                        <span className="text-sm text-white">
                          {validator.totalStaked.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}{" "}
                          BNB
                        </span>
                        <span className="ml-1.5 text-xs text-axion-text-muted">
                          ({validator.stakedPercent})
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-tabular text-sm text-white">
                        {validator.commission}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-tabular text-sm text-white">
                        {validator.apy}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-axion-success">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-axion-success opacity-75"></span>
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-axion-success"></span>
                        </span>
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="inline-flex items-center rounded-md bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand transition-all hover:bg-brand hover:text-white">
                        Delegate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-axion-border px-5 py-4 sm:flex-row">
            <p className="text-xs text-axion-text-muted">
              Total of {totalValidators} Validators
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-axion-border bg-axion-bg-tertiary text-axion-text-secondary transition-all hover:border-axion-border-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    page === currentPage
                      ? "bg-brand text-white"
                      : "border border-axion-border bg-axion-bg-tertiary text-axion-text-secondary hover:border-axion-border-hover hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-axion-border bg-axion-bg-tertiary text-axion-text-secondary transition-all hover:border-axion-border-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
