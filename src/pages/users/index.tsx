import * as React from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styled'
import { ApplicationState, ConnectedReduxProps } from '../../store'
import { User } from '../../store/users/types'
import { getAllUser } from '../../store/users/actions'
import { Dispatch } from 'redux';

import Paper from '@material-ui/core/Paper';
import DateRange from '@material-ui/icons/DateRange';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
  DataTypeProvider,  
} from '@devexpress/dx-react-grid';


interface PropsFromState {
  loading: boolean
  data: User[]
  errors?: string
}


interface PropsFromDispatch {
  getAllUser: typeof getAllUser
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps

const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'month') return <DateRange {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};

const styles = {
  numericInput: {
    textAlign: 'right',
    width: '100%',
  },
};


class UsersIndexPage extends React.Component<AllProps> {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'defaultRefundMethodId', title: 'ID' },
        { name: 'firstName', title: 'First Name' },
        { name: 'surname', title: 'Surname' },
        { name: 'email', title: 'Email' },
        { name: 'phoneNumber', title: 'Phone Number' },
        { name: 'residenceCity', title: 'City' },
        { name: 'residenceCountry', title: 'Country' },
        { name: 'newDate', title: 'Last Active' }        
      ],
      currentPage: 0,
      pageSize: 5,
      pageSizes: [5, 10, 15],
      dateColumns: ['newDate'],
      dateFilterOperations: ['month', 'contains', 'startsWith', 'endsWith'],
      filteringColumnExtensions: [
        {
          columnName: 'newDate',
          predicate: (value, filter, row) => {
            if (!filter.value.length) return true;
            if (filter && filter.operation === 'month') {
              const month = parseInt(value.split('-')[1], 10);
              console.log(month);
              return month === parseInt(filter.value, 10);
            }
            return IntegratedFiltering.defaultPredicate(value, filter, row);
          },
        },
      ],
    };    
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
  }
  public componentDidMount() {
    const { data } = this.props

    if (data.length === 0) {
      this.props.getAllUser()
    }
  }



  public render() {
    const { columns, pageSize, dateColumns, dateFilterOperations,pageSizes, currentPage,filteringColumnExtensions, } = this.state;
    const { data } = this.props;
    return (
      <Paper>
        <Grid
          rows={data}
          columns={columns}
        >
        <DataTypeProvider
            for={dateColumns}
            availableFilterOperations={dateFilterOperations}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <IntegratedPaging />
          <FilteringState defaultFilters={[]} />
          {/* <IntegratedFiltering /> */}
          <IntegratedFiltering columnExtensions={filteringColumnExtensions} />
          <SortingState
            defaultSorting={[{ columnName: '', direction: 'asc' }]}
          />
          <IntegratedSorting />
          <Table />
          <TableHeaderRow showSortingControls />
          {/* <TableFilterRow /> */}
          <TableFilterRow
            showFilterSelector
            iconComponent={FilterIcon}
            messages={{ month: 'Month equals' }}
          />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
      </Paper>
    );
  }

}

const mapStateToProps = ({ users }: ApplicationState) => ({
  loading: users.loading,
  errors: users.errors,
  data: users.data
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  getAllUser: () => dispatch(getAllUser())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersIndexPage)

const TableWrapper = styled('div')`
  position: relative;
  max-width: ${props => props.theme.widths.md};
  margin: 0 auto;
  min-height: 200px;
`

const UserDetail = styled('td')`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 66px;
`

const UserLogo = styled('img')`
  width: 50px;
  height: 50px;
`

const UserName = styled('div')`
  flex: 1 1 auto;
  height: 100%;
  margin-left: 1rem;

  a {
    color: ${props => props.theme.colors.brand};
  }
`
