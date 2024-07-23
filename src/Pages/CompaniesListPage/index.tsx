import { Helmet } from "react-helmet-async";
import Layout from "../../Components/Layout";
import styles from "./CompaniesListPage.module.scss";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "../../Store/store";
import {
  fetchAllCompanies,
  setActiveCompanyPage,
} from "../../Store/company/slice";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import Pagination from "../../Components/Pagination";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "../../Store/store";
import {
  fetchAllCompanies,
  setActiveCompanyPage,
} from "../../Store/company/slice";
import { useSelector } from "react-redux";
import { ReduxStatus } from "../../Types/enums";
import Pagination from "../../Components/Pagination";
import { Link } from "react-router-dom";

const CompaniesListPage = () => {
  const dispatch = useAppDispatch();
  const { companies, pagination, companiesStatus } = useSelector(
    (state: RootState) => state.company
  );
  const { token } = useSelector((state: RootState) => state.user);
  const page_size = 20;
  const current_page = pagination?.current_page ?? 1;
  const total_page = pagination?.total_page ?? 5;

  const handlePageChange = (pageNumber: number) => {
    dispatch(setActiveCompanyPage(pageNumber));
  };

  const handlePrevious = () => {
    if (current_page > 1) {
      dispatch(setActiveCompanyPage(current_page - 1));
    }
  };

  const handleNext = () => {
    if (current_page < total_page) {
      dispatch(setActiveCompanyPage(current_page + 1));
    }
  };

  useEffect(() => {
    if (companiesStatus === ReduxStatus.INIT) {
      dispatch(
        fetchAllCompanies({
          token: token ?? "",
          page: pagination?.current_page ?? 1,
          page_size,
        })
      );
    }
  }, [companiesStatus, dispatch, pagination, token]);
  return (
    <Layout>
      <Helmet>
        <title>List of companies</title>
      </Helmet>

      <div className={styles.wrapper}>
        <h1>List of companies</h1>
        <div className={styles.companyList}>
          {companies.length > 0 ? (
            companies.map((company) => (
              <div key={company.company_id} className={styles.companyCard}>
                <div className={styles.avatarContainer}>
                  {company.company_avatar ? (
                    <img
                      src={company.company_avatar}
                      alt={company.company_name}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>No Image</div>
                  )}
                </div>
                <div className={styles.companyDetails}>
                  <h3 className={styles.companyName}>{company.company_name}</h3>
                  {company.company_title && (
                    <p className={styles.companyTitle}>
                      {company.company_title}
                    </p>
                  )}
                  <p className={styles.visibility}>
                    {company.is_visible ? "Visible" : "Hidden"}
                  </p>
                  <Link
                    to={`/companies/${company.company_id}`}
                    className={styles.showLink}
                  >
                    Show
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No companies available.</p>
          )}
        </div>
        <Pagination
          pageCount={total_page}
          activePage={current_page}
          onPageChange={handlePageChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </Layout>
  );
};

export default CompaniesListPage;
